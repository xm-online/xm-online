/** It's marker decorator for translations script.
 *  If component use ONLY global translation, please mark component using this decorator for avoid script warning.
 * */
export function UseGlobalTranslations() {
    return function(target: any) {}
}
