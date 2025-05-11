import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CharTabsProps = {
  enlaces: React.ReactNode;
  clicks: React.ReactNode;
};

export function CharTabs({ enlaces, clicks }: CharTabsProps) {
  return (
    <Tabs defaultValue="enlaces" className="w-full pt-2 ">
      <TabsList className="grid  grid-cols-2 border">
        <TabsTrigger value="enlaces">Enlaces</TabsTrigger>
        <TabsTrigger value="clicks">Clicks</TabsTrigger>
      </TabsList>
      <TabsContent value="enlaces">{enlaces}</TabsContent>
      <TabsContent value="clicks">{clicks}</TabsContent>
    </Tabs>
  );
}
