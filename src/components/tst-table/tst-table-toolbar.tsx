"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Filter,
  FilterX,
  GalleryThumbnails,
  Printer,
  RefreshCw,
  Search,
  SearchX,
  Sheet,
  XIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";
import React, { useMemo, useRef } from "react";
import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TstTableToolbarProps {
  table: Table<any>;
  viewSelector?: boolean;
  refetch?: () => void;
  customComponents?: any;
  setGlobalFilter: (value: string) => void;
  globalFilter: string;
  enableFilter: boolean;
  setEnableFilter: (value: boolean) => void;
  csvData?: any[];
  printFunction?: () => void;
  disablePrint?: boolean;
  disableExport?: boolean;
  disableViewSelector?: boolean;
  disableSearch?: boolean;
}

export const TstTableToolBar = (props: TstTableToolbarProps) => {
  const { table, globalFilter, setGlobalFilter } = props;
  const { t } = useTranslation();
  const [openSearch, setOpenSearch] = React.useState(false);

  const ViewSelector = () => {
    return (
      <>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-3">
                <GalleryThumbnails className="w-5 rotate-180 mr-2" />
                {t("View")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Columns")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  table
                    .getAllColumns()
                    .forEach((column) => column.toggleVisibility(true))
                }
              >
                <Eye size="15" className="mr-2" /> {t("Mostra tutto")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table
                    .getAllColumns()
                    .forEach((column) => column.toggleVisibility(false))
                }
              >
                <EyeOff size="15" className="mr-2" /> {t("Nascondi tutto")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  };

  const RefetchButton = () => {
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={props.refetch}>
              <RefreshCw className="w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-primary border-primary border-[1px]">
            <p className="text-xs">{t("Aggiorna")}</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
  };

  const ExportCsv = () => {
    const CSVData =
      props.csvData ??
      table.getRowModel().flatRows.map((row) => {
        return row.original;
      });
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <Button>
              <CSVLink
                data={props.csvData?.length === 0 ? props.csvData : CSVData}
                target="_blank"
              >
                <Sheet className="w-5" />
              </CSVLink>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-primary border-primary border-[1px]">
            <p className="text-xs">{t("Esporta CSV")}</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
  };

  const PtintTable = () => {
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
    const data =
      props.csvData ??
      table.getRowModel().flatRows.map((row) => {
        return row.original;
      });

    return (
      <>
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={handlePrint}>
                <Printer className="w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-primary border-primary border-[1px]">
              <p className="text-xs">{t("Stampa")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="hidden bg-white">
          <div ref={componentRef} className="bg-white p-5 h-screen w-screen">
            <style type="text/css" media="print">
              {"@media print { html, body {background-color: #fff !important}}"}
            </style>
            <table className="bg-white text-black p-3 border-2 rounded-md text-center ">
              <thead>
                <tr className="p-2">
                  {Object.keys(data[0] || {}).map((col) => {
                    return (
                      <>
                        <td>{t(col)}</td>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  return (
                    <>
                      <tr className="p-2">
                        {Object.values(row).map((rowData) => {
                          return (
                            <>
                              <td>
                                {JSON.stringify(rowData).replace(/['"]+/g, "")}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const PrintAction = () => {
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={props.printFunction}>
              <Printer className="w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-primary border-primary border-[1px]">
            <p className="text-xs">{t("Stampa")}</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
  };

  const SearchComponent = useMemo(() => {
    return (
      <>
        {openSearch && (
          <div className="animate-fade-left flex items-center">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg border-t-0 border-r-0 border-l-0 rounded-none shadow-none focus-visible:ring-0"
              placeholder={t("Cerca...")}
              autoFocus={openSearch}
            />
            <Button
              variant={"ghost"}
              className="absolute justify-end right-0 px-0 hover:bg-transparent"
              onClick={() => {
                setGlobalFilter("");
              }}
            >
              <XIcon />
            </Button>
          </div>
        )}
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={() => setOpenSearch(!openSearch)}>
                {openSearch ? (
                  <SearchX className="w-5" />
                ) : (
                  <Search className="w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground text-primary border-primary border-[1px]">
              <p className="text-xs">{t("Cerca")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </>
    );
  }, [openSearch, globalFilter]);

  const ViewFilter = () => {
    return (
      <div>
        <Button onClick={() => props.setEnableFilter(!props.enableFilter)}>
          {!props.enableFilter ? (
            <Filter className="w-5" />
          ) : (
            <FilterX className="w-5" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <>
      <TooltipProvider>
        <div className="w-full flex justify-between p-3">
          <div>{props.customComponents && props.customComponents}</div>
          <div className="flex gap-3">
            {props.disableSearch !== true && SearchComponent}
            {props.refetch && <RefetchButton />}
            {props.disableExport !== true && <ExportCsv />}
            {props.printFunction ? (
              <PrintAction />
            ) : (
              props.disablePrint !== true && <PtintTable />
            )}
            {props.disableViewSelector !== true && <ViewFilter />}
            {props.viewSelector !== false && <ViewSelector />}
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      id="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
