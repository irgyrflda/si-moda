import db from "@config/database";
import CustomError from "@middleware/error-handler";
import { keterangan_seminar } from "@models/trx-seminar-mhs.models";
import { QueryTypes } from "sequelize";
import puppeteer from "puppeteer";

const generateDokumenKelayakan = async (
    nim: string,
    keteranganSeminar: string
) => {
    try {
        let inBab = ['BAB I', 'BAB II', 'BAB III']

        if (keteranganSeminar === keterangan_seminar.hasil || keteranganSeminar === keterangan_seminar.sidang_akhir) {
            inBab = ['BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V', 'BAB VI']
        }

        const getDataBimbingan = await db.query(`SELECT a.id_trx_bimbingan, a.nim, u.nama_user,
        t.judul_tesis, a.tgl_upload, a.tgl_review,
        c.materi_pembahasan, b.id_sub_materi_pembahasan, 
        b.sub_materi_pembahasan, b.status_sub_materi
        FROM trx_bimbingan_mhs a
        JOIN ref_sub_materi_pembahasan b
        ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan
        JOIN ref_materi_pembahasan c
        ON b.id_materi_pembahasan = c.id_materi_pembahasan
        JOIN ref_user u
        ON a.nim = u.nomor_induk
        JOIN ref_tesis_mahasiswa t
        ON a.nim = t.nim
        WHERE a.nim = :nim
        AND a.id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan)
        FROM trx_bimbingan_mhs 
        WHERE nim = :nim
        GROUP BY id_sub_materi_pembahasan)
        AND c.materi_pembahasan IN (:bab)`,
            {
                replacements: { nim: nim, bab: inBab },
                type: QueryTypes.SELECT
            }
        )

        const getPersetujuanDospem = await db.query(`SELECT b.id_trx_bimbingan, 
        b.status_persetujuan, b.tgl_detail_review,
        f.nidn, f.nama_dospem, e.keterangan_dospem
        FROM trx_bimbingan_mhs a
        JOIN ref_bimbingan_mhs b
        ON a.id_trx_bimbingan = b.id_trx_bimbingan
        JOIN ref_sub_materi_pembahasan c
        ON a.id_sub_materi_pembahasan = c.id_sub_materi_pembahasan
        JOIN ref_materi_pembahasan d
        ON c.id_materi_pembahasan = d.id_materi_pembahasan
        JOIN ref_dospem_mhs e
        ON b.id_dospem_mhs = e.id_dospem_mhs
        JOIN ref_dospem f
        ON e.nidn = f.nidn
        WHERE a.id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan)
        FROM trx_bimbingan_mhs 
        WHERE nim = :nim
        GROUP BY id_sub_materi_pembahasan)
        AND d.materi_pembahasan IN (:bab)`,
            {
                replacements: { nim: nim, bab: inBab },
                type: QueryTypes.SELECT
            }
        )

        let dataMap: any[] = []

        let dataPersetujuan = new Map()
        getPersetujuanDospem.forEach((items: any) => {
            if (dataPersetujuan.has(items.id_trx_bimbingan)) {
                dataPersetujuan.get(items.id_trx_bimbingan).push(items);
            } else {
                dataPersetujuan.set(items.id_trx_bimbingan, [items]);
            }
        });

        getDataBimbingan.forEach((a: any) => {
            dataMap.push({
                id_trx_bimbingan: a.id_trx_bimbingan,
                nim: a.nim,
                nama: a.nama_user,
                judul_tesis: a.judul_tesis,
                tgl_upload: a.tgl_upload,
                tgl_review: a.tgl_review,
                materi_pembahasan: a.materi_pembahasan,
                id_sub_materi_pembahasan: a.id_sub_materi_pembahasan,
                sub_materi_pembahasan: a.sub_materi_pembahasan,
                status_sub_materi: a.status_sub_materi,
                persetujuan_dospem: dataPersetujuan.get(a.id_trx_bimbingan)
            })
        });

        const judulPdf = `Dokumen Kelayakan Mahasiswa`
        const htmlContent = `
        <html>
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }

            table, th, td {
                border: 1px solid black;
            }

            th, td {
                padding: 8px;
                text-align: left;
            }

            th {
                background-color: #f2f2f2;
            }
            </style>
        </head>
        <body>
            <body>
            <h1 style="text-align: center;">${judulPdf}</h1>
            <h3>NIM : ${dataMap[0].nim}</h3>
            <h3>Nama : ${dataMap[0].nama}</h3>
            <h3>Judul Tesis : ${dataMap[0].judul_tesis}</h3>
            <table>
                <thead>
                <tr>
                    <th>Bab</th>
                    <th>Sub Bab</th>
                    <th>Tanggal Upload</th>
                    <th>Persetujuan dospem 1</th>
                    <th>Persetujuan dospem 2</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataMap.map((items: any) => `
                    <tr>
                        <td>${items.materi_pembahasan}</td>
                        <td>${items.sub_materi_pembahasan}</td>
                        <td>${items.tgl_upload}</td>
                        <td>
                            Nidn : ${items.persetujuan_dospem[1].nidn} <br>
                            Nama : ${items.persetujuan_dospem[1].nama_dospem} <br>
                            Persetujuan : ${items.persetujuan_dospem[1].status_persetujuan} <br>
                            tgl : ${items.persetujuan_dospem[1].tgl_detail_review}
                        </td>
                        <td>
                            Nidn : ${items.persetujuan_dospem[0].nidn} <br>
                            Nama : ${items.persetujuan_dospem[0].nama_dospem} <br>
                            Persetujuan : ${items.persetujuan_dospem[0].status_persetujuan} <br>
                            tgl : ${items.persetujuan_dospem[0].tgl_detail_review}
                        </td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            </body>
        </html>`

        const browser = await puppeteer.launch({
            headless: "new",
            // executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
        });

        const pdfBuffer = await page.pdf({
            format: 'A3',
            // landscape: true,
            printBackground: true,
            margin: {
                top: '50px',
                // bottom: '20px',
                left: '20px',
                right: '20px',
            },
        });

        await browser.close();

        return pdfBuffer;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    generateDokumenKelayakan
}