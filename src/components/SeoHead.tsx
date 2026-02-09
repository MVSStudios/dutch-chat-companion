import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SeoHeadProps {
  slug: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const SeoHead = ({ slug, fallbackTitle, fallbackDescription }: SeoHeadProps) => {
  const { data: seo } = useQuery({
    queryKey: ["seo", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_settings")
        .select("*")
        .eq("page_slug", slug)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    const title = seo?.page_title || fallbackTitle || "J&C Motorhomes";
    const description = seo?.meta_description || fallbackDescription || "";

    document.title = title;

    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", seo?.og_title || title);
    setMeta("og:description", seo?.og_description || description);
    if (seo?.og_image) setMeta("og:image", seo.og_image);
  }, [seo, fallbackTitle, fallbackDescription]);

  return null;
};

export default SeoHead;
