import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ExportProgress {
  percent: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  private hubConnection: signalR.HubConnection | null = null;
  progress$ = new Subject<ExportProgress>();

  constructor(private http: HttpClient) {}

  async exportPricing(operatorSeasonRouteId: number, token: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubWsUrl}/hubs/export`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ExportProgress', (percent: number, message: string) => {
      this.progress$.next({ percent, message });
    });

    await this.hubConnection.start();
    const connectionId = await this.hubConnection.invoke<string>('JoinExportGroup');

    this.http.post(
      `${environment.hubUrl}/api/export/pricing/${operatorSeasonRouteId}`,
      null,
      {
        params: { connectionId },
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pricing_${operatorSeasonRouteId}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.stopConnection();
      },
      error: () => {
        this.progress$.next({ percent: 0, message: 'Export failed.' });
        this.stopConnection();
      }
    });
  }

  private async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }
}