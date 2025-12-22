export interface Card {
  id: string;
  initiative: string | number;
  cardName: string;
  tier: string;
  color: string;
  defense?: string;
  movement?: string;
  attack?: string;
  actionType: string;
  rangeRadius?: string;
  cardText: string;
  flavorText?: string;
  itemIcon?: string;
}

export interface Spell extends Card {}

export interface Character {
  name: string;
  cardCount: number;
}

export interface CharacterData extends Character {
  cards: Card[];
}
