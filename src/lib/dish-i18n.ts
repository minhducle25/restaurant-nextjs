// Map dish names from database to i18n keys
export const dishNameToKey: Record<string, string> = {
  'Smashed Avocado Toast': 'smashedAvocadoToast',
  'Eggs Benedict': 'eggsBenedict',
  'Big Breakfast Platter': 'bigBreakfastPlatter',
  'Acai Breakfast Bowl': 'acaiBreakfastBowl',
  'Buttermilk Pancakes': 'buttermilkPancakes'
}

// Helper to get i18n key for a dish name
export function getDishKey(dishName: string): string {
  return dishNameToKey[dishName] || ''
}

// Helper to check if dish has translation
export function hasDishTranslation(dishName: string): boolean {
  return dishName in dishNameToKey
}
