<?php

namespace App\Events;

use App\Models\Board;
use App\Models\Card;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $card;
    public $board;

    /**
     * Create a new event instance.
     *
     * @param Card $card
     * @param Board $board
     * @return void
     */
    public function __construct(Card $card, Board $board)
    {
        $this->card = $card;
        $this->board = $board;
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
                'description' => $this->card->description,
                'due_date' => $this->card->due_date,
                'assigned_to' => $this->card->assigned_to,
                'updated_at' => $this->card->updated_at,
            ],
        ];
    }
}