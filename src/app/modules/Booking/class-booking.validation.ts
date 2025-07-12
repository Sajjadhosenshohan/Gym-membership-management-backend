
import { z } from 'zod';

const createClassScheduleSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  trainerId: z.string(),
});


export const classScheduleValidation = {
  createClassScheduleSchema
};
