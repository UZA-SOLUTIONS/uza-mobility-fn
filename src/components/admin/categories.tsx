'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissions } from '@/hooks/permissions';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAddSubcategory,
  useCategories,
  useCreateCategory,
  useDeactivateCategory,
} from '@/queries/admin';
import {
  createCategorySchema,
  type CreateCategoryInput,
} from '@/schemas/admin';
import type { Category } from '@/types/admin/marketplace';

const categoryTypes = [
  { value: 'PASSENGER_EV', label: 'Passenger EV' },
  { value: 'TWO_THREE_WHEEL', label: '2–3 wheel' },
  { value: 'COMMERCIAL_EV', label: 'Commercial EV' },
  { value: 'EV_PARTS_ACCESSORIES', label: 'Parts & accessories' },
  { value: 'EV_INFRASTRUCTURE_ENERGY', label: 'Infrastructure & energy' },
] as const;

function CategoryCard({ category }: { category: Category }) {
  const { isSuperAdmin } = usePermissions();
  const deactivate = useDeactivateCategory();
  const [subOpen, setSubOpen] = useState(false);
  const addSub = useAddSubcategory();
  const [subName, setSubName] = useState('');

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{category.name}</CardTitle>
            <CardDescription>
              {category.slug} · {category.type.replaceAll('_', ' ')}
            </CardDescription>
          </div>
          {isSuperAdmin ? (
            <Button
              size="sm"
              variant="outline"
              disabled={deactivate.isPending}
              onClick={() => {
                if (window.confirm(`Deactivate category "${category.name}"?`)) {
                  deactivate.mutate(category.id);
                }
              }}
            >
              Deactivate
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.subcategories?.length ? (
          <ul className="space-y-1 text-sm">
            {category.subcategories.map((sub) => (
              <li key={sub.id} className="text-muted-foreground">
                {sub.name} <span className="text-xs">({sub.slug})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No subcategories yet.</p>
        )}
        <Button size="sm" variant="ghost" onClick={() => setSubOpen(true)}>
          Add subcategory
        </Button>
      </CardContent>

      <Dialog open={subOpen} onOpenChange={setSubOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={addSub.isPending || !subName.trim()}
              onClick={() =>
                addSub.mutate(
                  {
                    categoryId: category.id,
                    body: { name: subName.trim() },
                  },
                  {
                    onSuccess: () => {
                      setSubOpen(false);
                      setSubName('');
                    },
                  },
                )
              }
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function AdminCategoriesPanel() {
  const { data, isLoading, isError, error } = useCategories();
  const createCategory = useCreateCategory();
  const [createOpen, setCreateOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      type: 'PASSENGER_EV' as const,
      displayOrder: 0,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createCategory.mutate(values, {
      onSuccess: () => {
        setCreateOpen(false);
        form.reset();
      },
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Categories"
          description="Manage marketplace categories and subcategories."
        />
        <Button onClick={() => setCreateOpen(true)}>New category</Button>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : 'Failed to load categories.'}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" {...form.register('name')} />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) =>
                  form.setValue('type', value as CreateCategoryInput['type'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCategory.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
