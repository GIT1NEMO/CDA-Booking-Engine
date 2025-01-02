// Update the handleExtraSelection function
const handleExtraSelection = (adultId: number, extraId: string | null) => {
  console.log('Handling extra selection:', { adultId, extraId });
  
  setAdultSelections(prevSelections => {
    const newSelections = prevSelections.map(selection =>
      selection.adultId === adultId
        ? { ...selection, extraId }
        : selection
    );
    
    // Log the updated selections
    console.log('Updated selections:', newSelections);
    
    // Notify parent component immediately
    onSelectionsChange(newSelections);
    
    return newSelections;
  });
};