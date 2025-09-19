import { atom } from 'nanostores'

export interface EditModeState {
  isEditMode: boolean
}

export const $editModeState = atom<EditModeState>({
  isEditMode: false,
})
