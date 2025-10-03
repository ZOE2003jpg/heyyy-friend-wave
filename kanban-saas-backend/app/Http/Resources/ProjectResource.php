<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
            'team_id' => $this->team_id,
            'created_by' => $this->created_by,
            'boards' => $this->whenLoaded('boards', function() {
                return $this->boards->map(function($board) {
                    return [
                        'id' => $board->id,
                        'name' => $board->name,
                        'created_at' => $board->created_at,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}