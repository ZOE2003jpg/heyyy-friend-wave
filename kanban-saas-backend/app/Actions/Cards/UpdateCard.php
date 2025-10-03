<?php

namespace App\Actions\Cards;

use App\Models\Card;

class UpdateCard
{
    /**
     * Update a card's details.
     *
     * @param Card $card
     * @param string $title
     * @param string|null $description
     * @param string|null $dueDate
     * @param int|null $assignedTo
     * @return Card
     */
    public function execute(Card $card, string $title, ?string $description, ?string $dueDate = null, ?int $assignedTo = null): Card
    {
        $card->update([
            'title' => $title,
            'description' => $description,
            'due_date' => $dueDate,
            'assigned_to' => $assignedTo,
        ]);
        
        return $card->fresh();
    }
}