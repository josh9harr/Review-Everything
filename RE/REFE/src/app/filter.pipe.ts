import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], search: any): any {
    if(!items) return [];
    if(!search) return items;
    search = search.toLowerCase();
    return items.filter(data => {
      return data.toLowerCase().includes(search);
    });
  }

}
