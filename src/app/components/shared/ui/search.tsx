"use client"

import { SearchIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../../../utils/cn"
import { Button } from "./button"
import { Input } from "./input"

interface SearchProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onChange"> {
    placeholder?: string
    className?: string
    onChange?: (value: string) => void
}

export function Search({ placeholder = "Search...", className, onChange, ...props }: SearchProps) {
    const [value, setValue] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Search submitted:", value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        onChange?.(newValue)
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative flex w-full items-center", className)} {...props}>
            <Input
                type="search"
                placeholder={placeholder}
                className="pr-10 focus-visible:ring-black"
                value={value}
                onChange={handleChange}
            />
            <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
            >
                <SearchIcon className="w-4 h-4" />
                <span className="sr-only">Search</span>
            </Button>
        </form>
    )
}
