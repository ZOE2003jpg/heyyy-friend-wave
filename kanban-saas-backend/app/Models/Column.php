<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'board_id',
        'position',
        'color',
    ];

    /**
     * Get the board that owns the column.
     */
    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    /**
     * Get the cards for the column.
     */
    public function cards()
    {
        return $this->hasMany(Card::class)->orderBy('position');
    }
}