<?php

namespace App\Mail;

use App\Models\Employee;
use App\Models\Scan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmpolyeeRetardMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Employee $employee)
    {
        $this->employee = $employee->load('position');
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Empolyee Retard',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        $now = Carbon::now();
        $retards = Scan::where('employee_id', $this->employee->id)
        ->where('enRetard', true)
        ->whereYear('created_at', $now->year)
        ->whereMonth('created_at', $now->month)
        ->get();

        return new Content(
            view: 'mail.EmpolyeeRetardMail',
            with: [
                'employee'=>$this->employee,
                'retards'=>$retards
                
            ]
        );
    }

    
    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
