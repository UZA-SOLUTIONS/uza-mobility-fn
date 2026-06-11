import { useEffect, useRef } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type MutationLike = {
  reset: () => void;
};

/**
 * Re-apply form values only when the URL query string changes (e.g. navigation
 * from /login?email=a to /login?email=b). Does not re-run when the user edits
 * fields on the same URL.
 */
export function useAuthQueryReset<T extends FieldValues>(
  form: UseFormReturn<T>,
  mutation: MutationLike,
  queryKey: string,
  nextValues: T,
) {
  const lastKey = useRef<string | null>(null);
  const nextValuesRef = useRef(nextValues);
  nextValuesRef.current = nextValues;

  useEffect(() => {
    if (lastKey.current === null) {
      lastKey.current = queryKey;
      return;
    }

    if (lastKey.current === queryKey) {
      return;
    }

    lastKey.current = queryKey;
    form.reset(nextValuesRef.current);
    form.clearErrors();
    mutation.reset();
  }, [queryKey, form, mutation]);
}

/** Clear API feedback when the user edits relevant fields after a failed submit. */
export function useClearAuthFeedbackOnChange<T extends FieldValues>(
  form: UseFormReturn<T>,
  mutation: MutationLike,
  fields: Path<T>[],
) {
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  useEffect(() => {
    const subscription = form.watch((_value, { name, type }) => {
      if (type !== 'change' || !name) {
        return;
      }

      if (!fieldsRef.current.includes(name as Path<T>)) {
        return;
      }

      form.clearErrors('root');
      mutation.reset();
    });

    return () => subscription.unsubscribe();
  }, [form, mutation]);
}
