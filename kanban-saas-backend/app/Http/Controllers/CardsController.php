<?php

namespace App\Http\Controllers;

use App\Actions\Cards\CreateCard;
use App\Actions\Cards\MoveCard;
use App\Actions\Cards\UpdateCard;
use App\Events\CardMoved;
use App\Events\CardUpdated;
use App\Http\Requests\Cards\CreateCardRequest;
use App\Http\Requests\Cards\UpdateCardRequest;
use App\Http\Resources\CardResource;
use App\Models\Board;
use App\Models\Card;
use App\Models\Column;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CardsController extends Controller
{
    /**
     * Store a newly created card.
     *
     * @param CreateCardRequest $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Column $column
     * @return CardResource
     */
    public function store(CreateCardRequest $request, Team $team, Project $project, Board $board, Column $column)
    {
        $this->authorize('update', [$project, $team]);
        
        $createCard = new CreateCard();
        $card = $createCard->execute(
            $column,
            $request->title,
            $request->description,
            Auth::id(),
            $request->position
        );

        return new CardResource($card);
    }

    /**
     * Display the specified card.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @return CardResource
     */
    public function show(Team $team, Project $project, Board $board, Card $card)
    {
        $this->authorize('view', [$project, $team]);
        
        return new CardResource($card->load('comments.user', 'attachments'));
    }

    /**
     * Update the specified card.
     *
     * @param UpdateCardRequest $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @return CardResource
     */
    public function update(UpdateCardRequest $request, Team $team, Project $project, Board $board, Card $card)
    {
        $this->authorize('update', [$project, $team]);
        
        $updateCard = new UpdateCard();
        $card = $updateCard->execute(
            $card,
            $request->title,
            $request->description,
            $request->due_date,
            $request->assigned_to
        );

        // Broadcast the card update event
        broadcast(new CardUpdated($card, $board))->toOthers();

        return new CardResource($card);
    }

    /**
     * Move a card to a different column or position.
     *
     * @param Request $request
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @return CardResource
     */
    public function move(Request $request, Team $team, Project $project, Board $board, Card $card)
    {
        $this->authorize('update', [$project, $team]);
        
        $request->validate([
            'column_id' => 'required|exists:columns,id',
            'position' => 'required|integer|min:0',
        ]);

        $targetColumn = Column::findOrFail($request->column_id);
        
        // Ensure the target column belongs to the same board
        if ($targetColumn->board_id !== $board->id) {
            return response()->json(['message' => 'Target column does not belong to this board'], 400);
        }

        $moveCard = new MoveCard();
        $card = $moveCard->execute($card, $targetColumn, $request->position);

        // Broadcast the card moved event
        broadcast(new CardMoved($card, $board, $targetColumn))->toOthers();

        return new CardResource($card);
    }

    /**
     * Remove the specified card.
     *
     * @param Team $team
     * @param Project $project
     * @param Board $board
     * @param Card $card
     * @return \Illuminate\Http\Response
     */
    public function destroy(Team $team, Project $project, Board $board, Card $card)
    {
        $this->authorize('update', [$project, $team]);
        
        // Reorder remaining cards in the column
        $card->column->cards()
            ->where('position', '>', $card->position)
            ->decrement('position');
            
        $card->delete();

        return response()->noContent();
    }
}