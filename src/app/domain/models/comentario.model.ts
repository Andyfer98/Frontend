import { CandidataModel } from "./candidata.model"
import { EstudianteModel } from "./estudiante.model"

export interface ComentarioModel {
    id?: number
    comentario?: string
    estudianteId?: number
    candidataId?: number
    fechaRegistro?: Date
    estudiante?: EstudianteModel
    candidata?: CandidataModel
}