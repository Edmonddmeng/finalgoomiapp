// services/savedProfilesService.ts
import { apiClient } from '@/lib/apiClient'

export interface SavedProfile {
  id: string
  username: string
  email: string
  profile_picture?: string
  role?: string
  created_at: string
}

class SavedProfilesService {
  async getSavedProfiles(): Promise<SavedProfile[]> {
    const response = await apiClient.get<{ savedProfiles: SavedProfile[] }>('/users/profile/saved')
    return response.data.savedProfiles
  }

  async saveProfile(savedUserId: string): Promise<void> {
    await apiClient.post('/users/profile/save', {
      saved_user_id: savedUserId
    })
  }

  async removeSavedProfile(savedUserId: string): Promise<void> {
    await apiClient.delete('/users/profile/remove', {
      data: { saved_user_id: savedUserId }
    })
  }
}

export const savedProfilesService = new SavedProfilesService()