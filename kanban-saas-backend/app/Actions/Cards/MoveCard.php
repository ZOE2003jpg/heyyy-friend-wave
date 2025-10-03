<?php

namespace App\Actions\Cards;

use App\Models\Card;
use App\Models\Column;

class MoveCard
{
    /**
     * Move a card to a different column or position.
     *
     * @param Card $card
     * @param Column $targetColumn
     * @param int $position
     * @return Card
     */
    public function execute(Card $card, Column $targetColumn, int $position): Card
    {
        $sourceColumn = $card->column;
        $oldPosition = $card->position;
        
        // If moving to a different column
        if ($sourceColumn->id !== $targetColumn->id) {
            // Reorder cards in the source column
            $sourceColumn->cards()
                ->where('position', '>', $oldPosition)
                ->decrement('position');
                
            // Reorder cards in the target column
            $targetColumn->cards()
                ->where('position', '>=', $position)
                ->increment('position');
                
            // Update the card
            $card->update([
                'column_id' => $targetColumn->id,
                'position' => $position,
            ]);
        } else {
            // Moving within the same column
            if ($oldPosition < $position) {
                // Moving down, decrement positions of cards in between
                $sourceColumn->cards()
                    ->where('position', '>', $oldPosition)
                    ->where('position', '<=', $position)
                    ->decrement('position');
            } else {
                // Moving up, increment positions of cards in between
                $sourceColumn->cards()
                    ->where('position', '<', $oldPosition)
                    ->where('position', '>=', $position)
                    ->increment('position');
            }
            
            // Update the card position
            $card->update([
                'position' => $position,
            ]);
        }
        
        return $card->fresh();
    }
}