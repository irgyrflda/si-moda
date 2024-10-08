import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefTersisMhs from "./ref-tesis-mhs.models";
import RefDosepem from "./ref-dospem.models";

export enum agenda_pertemuan {
    online = "online",
    offline = "offline"
}

export enum status_persetujuan_jadwal{
    setuju = "setuju",
    belum_disetujui = "belum disetujui"
}

export enum kategori_agenda {
    bimbinga_dosen = "bimbingan",
    seminar_proposal = "seminar proposal",
    seminar_hasil = "seminar hasil",
    ujuan_sidang = "ujian sidang"
}

interface ITrxAgendaAttributes {
    id_trx_agenda: number | null | undefined;
    nim: string | null | undefined;
    nidn: string | null | undefined;
    agenda_pertemuan: agenda_pertemuan;
    kategori_agenda: kategori_agenda;
    status_persetujuan_jadwal: status_persetujuan_jadwal;
    keterangan_bimbingan: string;
    lokasi: string;
    tgl_bimbingan: Date;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxAgendaOutput = Required<ITrxAgendaAttributes>;
export type TrxAgendaInput = Optional<
    ITrxAgendaAttributes,
    "nim" | "nidn" | "id_trx_agenda" | "status_persetujuan_jadwal" | "lokasi" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxAgenda
    extends Model<ITrxAgendaAttributes, TrxAgendaInput>
    implements ITrxAgendaAttributes {
    declare id_trx_agenda: number | null | undefined;
    declare nim: string | null | undefined;
    declare nidn: string | null | undefined;
    declare agenda_pertemuan: agenda_pertemuan;
    declare kategori_agenda: kategori_agenda;
    declare status_persetujuan_jadwal: status_persetujuan_jadwal;
    declare keterangan_bimbingan: string;
    declare lokasi: string;
    declare tgl_bimbingan: Date;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxAgenda.init(
    {
        id_trx_agenda: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nim: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nidn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        agenda_pertemuan: {
            type: DataTypes.ENUM("online", "offline"),
            allowNull: false
        },
        kategori_agenda: {
            type: DataTypes.ENUM("bimbingan dosen utama","bimbingan dosen pendamping","seminar proposal","seminar hasil","ujian sidang"),
            allowNull: false
        },
        status_persetujuan_jadwal: {
            type: DataTypes.ENUM("setuju", "belum disetujui"),
            allowNull: true,
            defaultValue: 'belum disetujui'
        },
        keterangan_bimbingan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lokasi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tgl_bimbingan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uc: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        uu: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE(),
            allowNull: true
        },
        update_at: {
            type: DataTypes.DATE(),
            allowNull: true
        }
    },
    {
        sequelize: db,
        tableName: "trx_agenda",
        modelName: "TrxAgenda",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxAgenda.hasMany(RefTersisMhs, {
    as: "agenda_tesis",
    foreignKey: "nim"
});

RefTersisMhs.belongsTo(TrxAgenda, {
    as: "tesis_agenda",
    foreignKey: "nim"
});

TrxAgenda.hasMany(RefDosepem, {
    as: "agenda_dospem",
    foreignKey: "nidn"
});

RefDosepem.belongsTo(TrxAgenda, {
    as: "dospem_agenda",
    foreignKey: "nidn"
});

export default TrxAgenda;