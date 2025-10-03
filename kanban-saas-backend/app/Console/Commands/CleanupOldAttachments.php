<?php

namespace App\Console\Commands;

use App\Models\File;
use App\Services\FileStorageService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupOldAttachments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attachments:cleanup {--days=30 : Number of days to keep deleted attachments}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up soft-deleted attachments older than specified days';

    /**
     * The file storage service.
     *
     * @var FileStorageService
     */
    protected $fileStorageService;

    /**
     * Create a new command instance.
     *
     * @param FileStorageService $fileStorageService
     * @return void
     */
    public function __construct(FileStorageService $fileStorageService)
    {
        parent::__construct();
        $this->fileStorageService = $fileStorageService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $days = $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);
        
        $this->info("Cleaning up attachments deleted before {$cutoffDate}");
        
        $files = File::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->get();
            
        $count = 0;
        
        foreach ($files as $file) {
            $this->fileStorageService->deleteFile($file->path);
            $file->forceDelete();
            $count++;
        }
        
        $this->info("Successfully removed {$count} old attachments");
        
        return 0;
    }
}