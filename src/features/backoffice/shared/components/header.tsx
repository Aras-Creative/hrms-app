import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BackofficeHeaderProps {
  title: string;
  description?: string;
}

export const BackofficeHeader = ({ title, description }: BackofficeHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    </Card>
  );
};
