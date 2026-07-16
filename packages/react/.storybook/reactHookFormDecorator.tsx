import { createContext, useContext, useState } from "react";
import type { ChangeEvent } from "react";
import type { Decorator } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { Button, TextInput } from "../src";
import styles from "./reactHookFormDecorator.module.scss";

type StoryFormValues = {
  confirmPassword: string;
  inputname: string;
  password: string;
  select: string;
};

const initialDefaultValues: StoryFormValues = {
  confirmPassword: "",
  inputname: "",
  password: "",
  select: "",
};

const StoryFormContext = createContext<UseFormReturn<StoryFormValues> | null>(
  null,
);

export const useStoryForm = () => useContext(StoryFormContext);

const reactHookFormDecorator: Decorator = (Story) => {
  const [defaultValues, setDefaultValues] =
    useState<StoryFormValues>(initialDefaultValues);
  const form = useForm<StoryFormValues>({
    defaultValues,
  });
  const { handleSubmit, watch, reset } = form;
  const [data, setData] = useState("");

  const setDefaultValuesFunc = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const values = JSON.parse(event.target.value);
      setDefaultValues(values);
    } catch {
      // Keep the last valid JSON object while the field is being edited.
    }
  };

  const resetInputs = () => {
    reset(defaultValues);
  };
  const currentValues = watch();

  return (
    <>
      <TextInput
        name="default values"
        labelText="Default values"
        defaultValue={JSON.stringify(defaultValues)}
        onChange={setDefaultValuesFunc}
      />
      <form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
        <div className={styles.preview}>
          <StoryFormContext.Provider value={form}>
            <Story />
          </StoryFormContext.Provider>
        </div>
        <Button type="submit">Submit</Button>{" "}
        <Button onClick={resetInputs} kind="tertiary">
          Reset
        </Button>
        <h4>Submitted form data</h4>
        <p>{data}</p>
        <h4>Current values</h4>
        <p>{JSON.stringify(currentValues)}</p>
      </form>
    </>
  );
};

export default reactHookFormDecorator;
