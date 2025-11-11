'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Add filter controls (category, price range, etc.) */}
        <p className="text-sm text-muted-foreground">Filtros próximamente</p>
      </CardContent>
    </Card>
  );
}
