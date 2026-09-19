import { TestBed } from '@angular/core/testing';
import { CartCounterComponent } from './cart-counter.component';

describe('CartCounterComponent', () => {
  function criar() {
    const fixture = TestBed.createComponent(CartCounterComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CartCounterComponent] });
  });

  it('deve iniciar com carrinho vazio e total zero', () => {
    const comp = criar();
    expect(comp.itens()).toEqual([]);
    expect(comp.total()).toBe(0);
  });

  it('deve somar quantidade x preço ao adicionar itens', () => {
    const comp = criar();
    comp.adicionar({ id: 1, nome: 'Maçã', preco: 2, quantidade: 3 });
    comp.adicionar({ id: 2, nome: 'Pera', preco: 5, quantidade: 1 });

    expect(comp.total()).toBe(11);
  });

  it('deve somar quantidade ao adicionar item já existente', () => {
    const comp = criar();
    comp.adicionar({ id: 1, nome: 'Maçã', preco: 2, quantidade: 1 });
    comp.adicionar({ id: 1, nome: 'Maçã', preco: 2, quantidade: 2 });

    expect(comp.itens().length).toBe(1);
    expect(comp.itens()[0].quantidade).toBe(3);
  });

  it('deve remover item pelo id', () => {
    const comp = criar();
    comp.adicionar({ id: 1, nome: 'Maçã', preco: 2, quantidade: 1 });
    comp.remover(1);
    expect(comp.itens()).toEqual([]);
  });
});
