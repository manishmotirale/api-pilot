"use client";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Loader, Plus, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const WorkSpace = () => {
  return (
    <>
      <Hint label="Change Workspace">
        <Button>
          <User className="size-4 text-white" />
          <span>Personal Workspace</span>
        </Button>
      </Hint>
    </>
  );
};

export default WorkSpace;
