<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'column_id',
        'position',
        'due_date',
        'assigned_to',
        'priority',
        'labels',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_date' => 'datetime',
        'labels' => 'array',
    ];

    /**
     * Get the column that owns the card.
     */
    public function column()
    {
        return $this->belongsTo(Column::class);
    }

    /**
     * Get the board through the column.
     */
    public function board()
    {
        return $this->hasOneThrough(Board::class, Column::class, 'id', 'id', 'column_id', 'board_id');
    }

    /**
     * Get the user assigned to the card.
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the comments for the card.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class)->orderBy('created_at');
    }

    /**
     * Get the attachments for the card.
     */
    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    /**
     * Get the activities for the card.
     */
    public function activities()
    {
        return $this->morphMany(Activity::class, 'subject');
    }
}