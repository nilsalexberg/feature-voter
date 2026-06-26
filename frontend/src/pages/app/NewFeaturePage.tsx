import { useNavigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { FeatureForm } from '@/components/FeatureForm';
import { useCreateFeature } from '@/hooks/useCreateFeature';
import { useCategories } from '@/hooks/useCategories';

export function NewFeaturePage() {
  const navigate = useNavigate();
  const { createFeature, isPending, error } = useCreateFeature();
  const { categories, isPending: categoriesLoading, error: categoriesError } = useCategories();

  async function handleSubmit(title: string, description: string, categoryId: number) {
    const feature = await createFeature(title, description, categoryId);
    if (feature) navigate('/');
  }

  return (
    <AppLayout>
      <div className="max-w-lg">
        <div className="mb-8">
          <h1 className="font-display italic text-[1.75rem] text-text leading-snug">
            New feature request
          </h1>
          <p className="text-sm text-muted mt-1">
            Describe what you'd like to see built.
          </p>
        </div>

        {categoriesLoading && <p className="text-sm text-muted">Loading…</p>}

        {categoriesError && <p className="text-sm text-danger">{categoriesError}</p>}

        {!categoriesLoading && !categoriesError && (
          <FeatureForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isPending={isPending}
            error={error}
            submitLabel="Submit request"
          />
        )}
      </div>
    </AppLayout>
  );
}
