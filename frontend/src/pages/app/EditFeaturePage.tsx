import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { FeatureForm } from '@/components/FeatureForm';
import { useFeatureRequest } from '@/hooks/useFeatureRequest';
import { useUpdateFeature } from '@/hooks/useUpdateFeature';

export function EditFeaturePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const featureId = Number(id);

  const { data: feature, isPending: isLoading, error: loadError } = useFeatureRequest(featureId);
  const { updateFeature, isPending: isSaving, error: saveError } = useUpdateFeature();

  async function handleSubmit(title: string, description: string) {
    const updated = await updateFeature(featureId, { title, description });
    if (updated) navigate('/');
  }

  return (
    <AppLayout>
      <div className="max-w-lg">
        <div className="mb-8">
          <h1 className="font-display italic text-[1.75rem] text-text leading-snug">
            Edit feature request
          </h1>
          <p className="text-sm text-muted mt-1">Update the title or description.</p>
        </div>

        {isLoading && (
          <p className="text-sm text-muted">Loading…</p>
        )}

        {loadError && (
          <p className="text-sm text-danger">{loadError}</p>
        )}

        {feature && (
          <FeatureForm
            defaultValues={{ title: feature.title, description: feature.description }}
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
