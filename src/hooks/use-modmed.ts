import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModMedClient } from '@/lib/modmed';

export function useModMedPatients() {
  return useQuery({
    queryKey: ['modmed', 'patients'],
    queryFn: async () => {
      const client = new ModMedClient();
      return client.getPatients();
    }
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patientData: any) => {
      const client = new ModMedClient();
      return client.createPatient(patientData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modmed', 'patients'] });
    }
  });
}