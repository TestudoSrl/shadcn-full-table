"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Edit, Info, MoreHorizontal, Trash2 } from "lucide-react";

interface TstTableMenuActionProps {
  detailFunction?: () => void;
  editFunction?: () => void;
  trashFunction?: () => void;
  customButtons?: any[];
  customDialog?: any;
}

export const TstTableMenuAction = (props: TstTableMenuActionProps) => {
  const { t } = useTranslation();

  const EditButton = () => {
    return (
      <DropdownMenuItem>
        <Button
          className="w-full flex justify-start p-0"
          variant={"ghost"}
          onClick={props.editFunction}
        >
          <Edit size="15" className="mr-2" /> {t("Modifica")}
        </Button>
      </DropdownMenuItem>
    );
  };

  const DetailButton = () => {
    return (
      <>
        <DropdownMenuItem>
          <Button
            className="w-full flex justify-start p-0"
            variant={"ghost"}
            onClick={props.detailFunction}
          >
            <Info size="15" className="mr-2" /> {t("Dettagli")}
          </Button>
        </DropdownMenuItem>
      </>
    );
  };

  const DeleteButton = () => {
    return (
      <>
        <DropdownMenuItem>
          <Button
            className="w-full flex justify-start text-destructive p-0"
            variant={"ghost"}
            onClick={props.trashFunction}
          >
            <Trash2 size="15" className="mr-2" /> {t("Dettagli")}
          </Button>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* DETAIL - EDIT BUTTON */}
            {props.detailFunction && <DetailButton />}
            {props.editFunction && <EditButton />}

            {/* CUSTOM BUTTONS */}
            {props.customButtons &&
              props.customButtons.map((button, index) => {
                return (
                  <DropdownMenuItem key={index}>{button}</DropdownMenuItem>
                );
              })}

            {/* CUSTOM DIALOG */}

            {/* DELETE BUTTON */}
            {props.trashFunction && <DeleteButton />}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* CUSTOM DIALOG */}
      </Dialog>
    </>
  );
};
