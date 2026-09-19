import { Component, computed, effect, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

/**
 * Questão 3.1 — contador de itens do carrinho usando exclusivamente Signals.
 */
@Component({
  selector: 'app-cart-counter',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatIconModule],
  template: `
    <ul>
      @for (item of itens(); track item.id) {
        <li>
          {{ item.nome }} — {{ item.quantidade }} x {{ item.preco | currency: 'BRL' }}
          <button mat-icon-button (click)="remover(item.id)" aria-label="Remover item">
            <mat-icon>delete</mat-icon>
          </button>
        </li>
      }
    </ul>
    <p>Total: {{ total() | currency: 'BRL' }}</p>
  `,
})
export class CartCounterComponent {
  /** Signal com a lista de itens do carrinho. */
  readonly itens = signal<ItemCarrinho[]>([]);

  /** Computed: total = soma de (quantidade × preço) de cada item. */
  readonly total = computed(() =>
    this.itens().reduce((soma, item) => soma + item.preco * item.quantidade, 0)
  );

  /** Output que emite sempre que o total mudar. */
  readonly totalMudou = output<number>();

  constructor() {
    effect(() => {
      this.totalMudou.emit(this.total());
    });
  }

  adicionar(item: ItemCarrinho): void {
    this.itens.update((atual) => {
      const existente = atual.find((i) => i.id === item.id);
      if (existente) {
        return atual.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + item.quantidade } : i
        );
      }
      return [...atual, item];
    });
  }

  remover(id: number): void {
    this.itens.update((atual) => atual.filter((i) => i.id !== id));
  }
}
