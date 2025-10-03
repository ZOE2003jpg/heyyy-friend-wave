<?php

namespace App\Events;

use App\Models\Board;
use App\Models\Card;
use App\Models\Column;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardMoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $card;
    public $board;
    public $column;

    /**
     * Create a new event instance.
     *
     * @param Card $card
     * @param Board $board
     * @param Column $column
     * @return void
     */
    public function __construct(Card $card, Board $board, Column $column)
    {
        $this->card = $card;
        $this->board = $board;
        $this->column = $column;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PresenceChannel('board.' . $this->board->id);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'card' => [
                'id' => $this->card->id,
                'title' => $this->card->title,
                'position' => $this->card->position,
            ],
            'column' => [
                'id' => $this->column->id,
                'name' => $this->column->name,
            ],
        ];
    }
}