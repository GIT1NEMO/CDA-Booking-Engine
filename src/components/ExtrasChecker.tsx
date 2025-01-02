// Update the ExtrasCheckerProps interface
interface ExtrasCheckerProps {
  tour: Tour;
  onExtrasUpdate: (extras: any[]) => void;
  savedExtras: any[];
}

export function ExtrasChecker({ tour, onExtrasUpdate, savedExtras: initialSavedExtras }: ExtrasCheckerProps) {
  // ... (keep existing state)
  const [savedExtras, setSavedExtras] = useState<any[]>(initialSavedExtras);

  const handleSaveExtra = (extra: any) => {
    const updatedExtras = [...savedExtras, extra];
    setSavedExtras(updatedExtras);
    setCurrentExtraDetails(null);
    onExtrasUpdate(updatedExtras);
  };

  const handleDeleteExtra = (extraId: string) => {
    const updatedExtras = savedExtras.filter(extra => extra.id !== extraId);
    setSavedExtras(updatedExtras);
    onExtrasUpdate(updatedExtras);
  };

  // ... (keep rest of the component)
}