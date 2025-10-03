<?php

namespace App\Notifications;

use App\Models\Card;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CardAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The card instance.
     *
     * @var Card
     */
    protected $card;

    /**
     * The user who assigned the card.
     *
     * @var User
     */
    protected $assignedBy;

    /**
     * Create a new notification instance.
     *
     * @param Card $card
     * @param User $assignedBy
     * @return void
     */
    public function __construct(Card $card, User $assignedBy)
    {
        $this->card = $card;
        $this->assignedBy = $assignedBy;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $boardName = $this->card->column->board->name;
        $projectName = $this->card->column->board->project->name;

        return (new MailMessage)
            ->subject("Card Assigned to You: {$this->card->title}")
            ->line("{$this->assignedBy->name} has assigned a card to you.")
            ->line("Card: {$this->card->title}")
            ->line("Board: {$boardName}")
            ->line("Project: {$projectName}")
            ->action('View Card', url("/projects/{$this->card->column->board->project->id}/boards/{$this->card->column->board->id}?card={$this->card->id}"))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'card_id' => $this->card->id,
            'card_title' => $this->card->title,
            'board_id' => $this->card->column->board->id,
            'board_name' => $this->card->column->board->name,
            'project_id' => $this->card->column->board->project->id,
            'project_name' => $this->card->column->board->project->name,
            'assigned_by' => [
                'id' => $this->assignedBy->id,
                'name' => $this->assignedBy->name,
            ],
        ];
    }
}