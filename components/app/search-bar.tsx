"use client";
import { Search } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SearchIcon } from "@/public/icons/search-icon";

const searchSchema = z.object({
  query: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function SearchBar() {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(data: SearchFormValues) {
    console.log("Search query:", data.query);
    // Handle search logic here
    form.reset({ query: "" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="relative">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Search messages"
                  className="border-border bg-background rounded-sm py-3 pr-4 pl-10 text-sm placeholder:text-sm placeholder:font-normal"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
