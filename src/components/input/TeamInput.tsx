import { Input } from "@nextui-org/react";

export function TeamInput({
    label,
    color,
    variant,
    value,
    onValueChange,
    className,
}: {
    label: string;
    color:
        | "primary"
        | "secondary"
        | "default"
        | "success"
        | "warning"
        | "danger"
        | undefined;
    variant: "flat" | "faded" | "bordered" | "underlined" | undefined;
    value: string;
    onValueChange: (arg0: string) => void;
    className: string;
}) {
    return (
        <Input
            label={label}
            color={color}
            variant={variant}
            isRequired
            value={value}
            onValueChange={onValueChange}
            className={className}
        />
    );
}
