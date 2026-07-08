-- Allow citizens to delete their own submissions (required for delete feature)
create policy "Citizens can delete own submissions"
  on public.submissions for delete
  using (auth.uid() = user_id);
