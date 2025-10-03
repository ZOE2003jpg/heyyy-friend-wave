<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'path',
        'mime_type',
        'size',
        'card_id',
        'user_id',
    ];

    /**
     * Get the card that owns the attachment.
     */
    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    /**
     * Get the user that uploaded the attachment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}