import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { FeatureForm } from '@/components/FeatureForm';
import { useFeatureRequest } from '@/hooks/useFeatureRequest';
import { useUpdateFeature } from '@/hooks/useUpdateFeature';
import { useCategories } from '@/hooks/useCategories';

export function EditFeaturePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const featureId = Number(id);

  const { data: feature, isPending: isLoading, error: loadError } = useFeatureRequest(featureId);
  const { updateFeature, isPending: isSaving, error: saveError } = useUpdateFeature();
  const { categories, isPending: categoriesLoading, error: categoriesError } = useCategories();

  async function handleSubmit(title: string, description: string, categoryId: number) {
    const updated = await updateFeature(featureId, { title, description, category_id: categoryId });
    if (updated) navigate('/');
  }

  const isReady = feature && !categoriesLoading && !categoriesError;

  return (
    <AppLayout>
      <div className="max-w-lg">
        <div className="mb-8">
          <h1 className="font-display italic text-[1.75rem] text-text leading-snug">
            Edit feature request
          </h1>
          <p className="text-sm text-muted mt-1">Update the title or description.</p>
        </div>

        {(isLoading || categoriesLoading) && (
          <p className="text-sm text-muted">Loading…</p>
        )}

        {(loadError || categoriesError) && (
          <p className="text-sm text-danger">{loadError ?? categoriesError}</p>
        )}

        {isReady && (
          <FeatureForm
            categories={categories}
            defaultValues={{
              title: feature.title,
              description: feature.description,
              category_id: feature.category.id,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isPending={isSaving}
            error={saveError}
            submitLabel="Save changes"
          />
        )}
      </div>
    </AppLayout>
  );
}
