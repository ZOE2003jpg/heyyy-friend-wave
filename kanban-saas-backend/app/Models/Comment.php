<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'card_id',
        'user_id',
    ];

    /**
     * Get the card that owns the comment.
     */
    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    /**
     * Get the user that created the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the activities for the comment.
     */
    public function activities()
    {
        return $this->morphMany(Activity::class, 'subject');
    }
}