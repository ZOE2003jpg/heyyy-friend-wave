<?php

namespace App\Actions\Cards;

use App\Models\Card;
use App\Models\Column;

class CreateCard
{
    /**
     * Create a new card in the specified column.
     *
     * @param Column $column
     * @param string $title
     * @param string|null $description
     * @param int $userId
     * @param int|null $position
     * @return Card
     */
    public function execute(Column $column, string $title, ?string $description, int $userId, ?int $position = null): Card
    {
        // If position is not provided, add to the end
        if (is_null($position)) {
            $position = $column->cards()->max('position') + 1;
        } else {
            // Reorder existing cards
            $column->cards()
                ->where('position', '>=', $position)
                ->increment('position');
        }

        return $column->cards()->create([
            'title' => $title,
            'description' => $description,
            'position' => $position,
            'created_by' => $userId,
        ]);
    }
}