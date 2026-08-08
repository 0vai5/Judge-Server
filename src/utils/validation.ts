import { ZodSchema } from "zod";

const validate = <T>(schema: ZodSchema<T>, data: any) => {
  return schema.safeParse(data);
};

export default validate;
