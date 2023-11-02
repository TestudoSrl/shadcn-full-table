"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { ArrowUpDown, EyeOff } from "lucide-react";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";

import { Button } from "../ui/button";
import React, { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../ui/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";

interface ColumnHeaderProps {
  column: Column<any>;
  title: any;
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
  sorrtingFunction: any;
}

export const ColumnHeaderComponent = (props: ColumnHeaderProps) => {
  const {
    column,
    title,
    showFilter: enableFilter,
    setShowFilter: setEnableFilter,
  } = props;
  const { t } = useTranslation();

  if (column.columnDef.enableColumnFilter === false) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{title}</span>
        </Button>
      </>
    );
  }

  return (
    <>
      <div className={"flex flex-col items-center space-x-2 p-2"}>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                >
                  <span>{title}</span>
                  {column.getIsSorted() === "desc" ? (
                    <ArrowDownIcon className="ml-2 h-4 w-4" />
                  ) : column.getIsSorted() === "asc" ? (
                    <ArrowUpIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("Asc")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("Desc")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEnableFilter(!enableFilter)}>
                <FilterIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("Filtra")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                {t("Hide")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {enableFilter && <FilterTypes column={column} />}
      </div>
    </>
  );
};

const FilterTypes = (props: { column: Column<any, unknown> }) => {
  const { t } = useTranslation();
  const filterType = (props.column.columnDef as any).filterType;
  let filterOptions = (props.column.columnDef as any).filterOptions;
  const [selectedValue, setSelectedValue] = React.useState<string>();
  const [inputValue, setInputValue] = React.useState<string | number>("");
  const [date, setDate] = React.useState<Date | undefined>();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  if (filterType === "date" && props.column.columnDef.filterFn === "auto") {
    props.column.columnDef.filterFn = (row, columnId, filterValue) => {
      const value = new Date(row.getValue(columnId) as string).setHours(
        0,
        0,
        0,
        0
      );
      return value === new Date(filterValue).setHours(0, 0, 0, 0);
    };
  }

  if (
    filterType === "dateRange" &&
    props.column.columnDef.filterFn === "auto"
  ) {
    props.column.columnDef.filterFn = (row, columnId, filterValue) => {
      const value = new Date(row.getValue(columnId) as string).getTime();
      const from = new Date(filterValue[0]).setHours(0, 0, 0, 0);
      const to = new Date(filterValue[1]).setHours(0, 0, 0, 0);
      return value >= from && value <= to;
    };
  }

  if (!filterType && props.column.columnDef.filterFn === "auto") {
    props.column.columnDef.filterFn = (row, columnId, filterValue) => {
      const value = (row.getValue(columnId) as string).toString();
      return value.includes(filterValue);
    };
  }

  if (filterType === "select" && !filterOptions) {
    //get all different values of the column
    const values = props.column.getFacetedRowModel();
    const arraySingleValues = values.flatRows.map((value) => {
      return value.getValue(props.column.id) as string;
    });

    //remove duplicates
    const uniqueValues: string[] = [...new Set(arraySingleValues)];
    filterOptions = uniqueValues.map((value) => {
      return { value: value, label: value };
    });
  }

  const InputFilter = useMemo(() => {
    return (
      <div className="flex relative flex-col items-center space-x-2 p-0">
        <Input
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            props.column.setFilterValue(String(value));
            setInputValue(value);
          }}
          className="p-2 font-lg border-b-2 border-t-0 border-r-0 border-l-0 rounded-none shadow-none focus-visible:ring-0"
          placeholder={t("Cerca...")}
        />
        <Button
          variant={"ghost"}
          className="absolute justify-end right-0 px-0 hover:bg-transparent"
        >
          <XIcon className="w-4" />
        </Button>
      </div>
    );
  }, [inputValue]);

  const SelectFilter = () => {
    return (
      <Select
        onValueChange={(e) => {
          props.column.setFilterValue(e);
          setSelectedValue(e as string);
        }}
        value={selectedValue}
      >
        <SelectTrigger
          value={selectedValue}
          className="w-full border-b-2 border-t-0 border-r-0 border-l-0 p-0 shadow-none rounded-none focus-visible:ring-0 focus:ring-0"
        >
          <SelectValue placeholder="Filtra" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option: any, index: number) => {
            return (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            );
          })}
          <Button
            variant={"ghost"}
            className="p-0 px-2 m-0 text-left"
            onClick={() => {
              props.column.setFilterValue("");
              setSelectedValue("");
            }}
          >
            <div className="flex items-center gap-2 text-destructive">
              <XIcon className="w-4" />
              <p>{t("Cancella")}</p>
            </div>
          </Button>
        </SelectContent>
      </Select>
    );
  };

  const DateFilter = useMemo(() => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "justify-start text-left font-normal border-b-2 border-t-0 border-r-0 border-l-0 p-0 shadow-none rounded-none focus-visible:ring-0 focus:ring-0",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "P") : <span>{t("Seleziona una data")}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              props.column.setFilterValue(new Date(date || "").toISOString());
            }}
            initialFocus
          />
          <Button
            className="m-auto mb-3"
            variant={"destructive"}
            onClick={() => {
              props.column.setFilterValue("");
              setDate(undefined);
            }}
          >
            <XIcon className="w-4 mr-2" />
            <p>{t("Cancella filtro")}</p>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }, [date]);

  const DateRangeFilter = useMemo(() => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal border-b-2 border-t-0 border-r-0 border-l-0 p-0 shadow-none rounded-none focus-visible:ring-0 focus:ring-0",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from && dateRange?.to
              ? `${format(dateRange.from, "P")} - ${format(dateRange.to, "P")}`
              : t("Seleziona una data")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col">
          <Calendar
            mode="range"
            initialFocus
            selected={dateRange}
            onSelect={(date) => {
              if (!date) return;
              setDateRange(date);
              if (!date.from || !date.to) return;
              props.column.setFilterValue([
                new Date(date.from || "").toISOString(),
                new Date(date.to || "").toISOString(),
              ]);
            }}
            numberOfMonths={2}
            defaultMonth={dateRange?.from}
          />
          <Button
            className="m-auto mb-3"
            variant={"destructive"}
            onClick={() => {
              props.column.setFilterValue("");
              setDateRange(undefined);
            }}
          >
            <XIcon className="w-4 mr-2" />
            <p>{t("Cancella filtro")}</p>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }, [dateRange]);

  switch (filterType) {
    case "select":
      return <SelectFilter />;
    case "input":
      return InputFilter;
    case "date":
      return DateFilter;
    case "dateRange":
      return DateRangeFilter;
    default:
      return InputFilter;
  }
};
