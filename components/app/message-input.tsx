"use client";
import type React from "react";
import { Button } from "../ui/button";
import { MessageInputProps } from "@/lib/prop.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "@/public/icons/send-icon";
import { Input } from "../ui/input";
import { useUpdateConversationMessages } from "@/hooks/tanstack/mutations/use-update-conversation-messages";

export default function MessageInput({
  userId,
  conversationId,
  chatContainerRef,
}: MessageInputProps) {
  if (!conversationId || !userId) return null;

  const sendMessageFormSchema = z.object({
    message: z.string(),
  });

  type SendMessageFormType = z.infer<typeof sendMessageFormSchema>;

  const form = useForm<SendMessageFormType>({
    resolver: zodResolver(sendMessageFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const sendMessageMutation = useUpdateConversationMessages(
    conversationId,
    userId,
  );

  const isSending = sendMessageMutation.isPending;

  const handleSubmit = (values: SendMessageFormType): void => {
    const messageInputValue = values.message.trim();
    form.reset({ message: "" });
    if (!messageInputValue || !userId) return;

    if (sendMessageMutation) {
      sendMessageMutation.mutateAsync({
        content: messageInputValue,
        senderId: userId,
      });
    }

    // Scroll to bottom after sending
    if (chatContainerRef?.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop =
          chatContainerRef.current!.scrollHeight;
      }, 100);
    }
  };

  const {
    formState: { isSubmitting },
    watch,
  } = form;
  const messageValue = watch("message");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="relative my-3 flex w-full items-center gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full overflow-hidden rounded-xl">
              <FormControl>
                <Input
                  placeholder="Type a message.."
                  className="bg-background-secondary placeholder:text-text-secondary min-h-14 w-full overflow-hidden rounded-xl p-2 pl-6 focus:outline-0"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full p-0"
          disabled={!messageValue || isSubmitting || isSending}
        >
          <SendIcon />
        </Button>
      </form>
    </Form>
  );
}
