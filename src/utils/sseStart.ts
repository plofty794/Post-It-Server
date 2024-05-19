import { NextFunction, Request, Response } from 'express';
import { eventEmitter } from './events/events';

export function sseStart(req: Request, res: Response, next: NextFunction) {
  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    eventEmitter.on('new-notification', (recipient: string) => {
      sseNewNotification(res, recipient);
    });
  } catch (error) {
    console.log(error);
  }
}

function sseNewNotification(res: Response, recipient: string) {
  res.write('event:' + 'new-notification' + '\n');
  res.write('data: ' + `You have a new notification user=${recipient}` + '\n\n');
}
