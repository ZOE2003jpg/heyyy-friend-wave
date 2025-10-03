<?php

namespace App\Services;

use App\Models\Board;

class BoardService
{
    /**
     * Create default columns for a new board.
     *
     * @param Board $board
     * @return void
     */
    public function createDefaultColumns(Board $board): void
    {
        $defaultColumns = [
            ['name' => 'To Do', 'position' => 0],
            ['name' => 'In Progress', 'position' => 1],
            ['name' => 'Done', 'position' => 2],
        ];

        foreach ($defaultColumns as $column) {
            $board->columns()->create($column);
        }
    }
}