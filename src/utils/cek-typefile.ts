type UploadedFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
};

type validasi = {
    status: boolean,
    message: string
}

const cekTypeFile = (files: UploadedFile[]): validasi => {
    if (files[0].mimetype !== 'application/pdf') {
        return {
            status: false,
            message: "File Pertama Harus Bertipe PDF"
        }
    }
    if (files[0].mimetype === files[1].mimetype) {
        return {
            status: false,
            message: "Tipe File Tidak Boleh Sama"
        }
    }
    return {
        status: true,
        message: "-"
    };
}

export default cekTypeFile;