import { CandidataModel } from "./candidata.model"
import { EstudianteModel } from "./estudiante.model"

export interface VotoModel {
    id?: number
    estudianteId?: number
    candidataId?: number
    fechaVotacion?: Date
    candidata?: CandidataModel
    estudiante?: EstudianteModel
}