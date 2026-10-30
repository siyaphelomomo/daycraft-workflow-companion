CREATE TABLE public.saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  tool text NOT NULL CHECK (tool IN ('email','summary','planner')),
  title text NOT NULL,
  input text NOT NULL,
  output text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.saved_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.saved_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.saved_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.saved_items FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX saved_items_user_idx ON public.saved_items(user_id, created_at DESC);